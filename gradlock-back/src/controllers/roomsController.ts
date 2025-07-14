import { Request, Response } from 'express';
import prisma from '../config/prismaClient';

export class RoomsController {
  static async getAllRooms(req: Request, res: Response): Promise<void> {
    try {
      const rooms = await prisma.room.findMany({
        orderBy: {
          name: 'asc'
        },
        select: {
          id: true,
          name: true,
          description: true,
          capacity: true,
          hasComputers: true,
          hasProjector: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.status(200).json({
        success: true,
        message: 'Salas recuperadas com sucesso',
        data: rooms,
        count: rooms.length
      });
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar salas',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  static async getRoomById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roomId = parseInt(id);

      // Validação do ID
      if (isNaN(roomId)) {
        res.status(400).json({
          success: false,
          message: 'ID da sala deve ser um número válido'
        });
        return;
      }

      // Busca a sala com suas reservas
      const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: {
          reservations: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  userType: true
                }
              }
            },
            orderBy: {
              date: 'desc'
            }
          }
        }
      });

      // Verifica se a sala existe
      if (!room) {
        res.status(404).json({
          success: false,
          message: 'Sala não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Sala encontrada com sucesso',
        data: room
      });
    } catch (error) {
      console.error('Erro ao buscar sala por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar sala',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
  static async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, capacity, hasComputers, hasProjector } = req.body;

      // Validações de entrada
      if (!name || !description || !capacity) {
        res.status(400).json({
          success: false,
          message: 'Cadastro não realizado. Todos os campos devem ser preenchidos!'
        });
        return;
      }

      // Validação do tipo de capacidade
      const roomCapacity = parseInt(capacity);
      if (isNaN(roomCapacity) || roomCapacity <= 0) {
        res.status(400).json({
          success: false,
          message: 'Capacidade deve ser um número positivo'
        });
        return;
      }

      // Verificar se a sala já existe
      const existingRoom = await prisma.room.findUnique({
        where: { name: name.trim() }
      });

      if (existingRoom) {
        res.status(409).json({
          success: false,
          message: 'Cadastro não realizado. Sala já existente!'
        });
        return;
      }

      // Criar a nova sala
      const newRoom = await prisma.room.create({
        data: {
          name: name.trim(),
          description: description.trim(),
          capacity: roomCapacity,
          hasComputers: Boolean(hasComputers),
          hasProjector: Boolean(hasProjector)
        }
      });

      res.status(201).json({
        success: true,
        message: 'Cadastro realizado com sucesso!',
        data: newRoom
      });
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao criar sala',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  static async updateRoom(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, capacity, hasComputers, hasProjector } = req.body;
      const roomId = parseInt(id);

      // Validação do ID
      if (isNaN(roomId)) {
        res.status(400).json({
          success: false,
          message: 'ID da sala deve ser um número válido'
        });
        return;
      }

      // Verificar se a sala existe
      const existingRoom = await prisma.room.findUnique({
        where: { id: roomId }
      });

      if (!existingRoom) {
        res.status(404).json({
          success: false,
          message: 'Sala não encontrada'
        });
        return;
      }

      // Preparar dados para atualização (apenas campos fornecidos)
      const updateData: any = {};

      if (name !== undefined) {
        if (!name.trim()) {
          res.status(400).json({
            success: false,
            message: 'Nome da sala não pode ser vazio'
          });
          return;
        }

        // Verificar se o novo nome já existe em outra sala
        const roomWithSameName = await prisma.room.findFirst({
          where: { 
            name: name.trim(),
            NOT: { id: roomId }
          }
        });

        if (roomWithSameName) {
          res.status(409).json({
            success: false,
            message: 'Falha na edição. Esse nome está indisponível'
          });
          return;
        }

        updateData.name = name.trim();
      }

      if (description !== undefined) {
        if (!description.trim()) {
          res.status(400).json({
            success: false,
            message: 'Descrição da sala não pode ser vazia'
          });
          return;
        }
        updateData.description = description.trim();
      }

      if (capacity !== undefined) {
        const roomCapacity = parseInt(capacity);
        if (isNaN(roomCapacity) || roomCapacity <= 0) {
          res.status(400).json({
            success: false,
            message: 'Falha na edição. A capacidade deve ser um número positivo!'
          });
          return;
        }
        updateData.capacity = roomCapacity;
      }

      if (hasComputers !== undefined) {
        updateData.hasComputers = Boolean(hasComputers);
      }

      if (hasProjector !== undefined) {
        updateData.hasProjector = Boolean(hasProjector);
      }

      // Se não há dados para atualizar
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Nenhum dado fornecido para atualização'
        });
        return;
      }

      // Atualizar a sala
      const updatedRoom = await prisma.room.update({
        where: { id: roomId },
        data: updateData
      }); 

      res.status(200).json({
        success: true,
        message: 'Sala atualizada com sucesso',
        data: updatedRoom
      });
    } catch (error) {
      console.error('Erro ao atualizar sala:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao atualizar sala',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  static async deleteRoom(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roomId = parseInt(id);

      // Validação do ID
      if (isNaN(roomId)) {
        res.status(400).json({
          success: false,
          message: 'ID da sala deve ser um número válido'
        });
        return;
      }

      // Verificar se a sala existe
      const existingRoom = await prisma.room.findUnique({
        where: { id: roomId },
        include: {
          reservations: true
        }
      });

      if (!existingRoom) {
        res.status(404).json({
          success: false,
          message: 'Sala não encontrada'
        });
        return;
      }

      // Verificar se há reservas ativas para esta sala
      const activeReservations = await prisma.reservation.findMany({
        where: {
          roomId: roomId,
          date: {
            gte: new Date() // Reservas futuras ou de hoje
          }
        }
      });

      if (activeReservations.length > 0) {
        res.status(409).json({
          success: false,
          message: 'Não é possível deletar a sala. Existem reservas ativas ou futuras para esta sala',
          data: {
            activeReservations: activeReservations.length
          }
        });
        return;
      }

      // Deletar a sala (as reservas passadas serão deletadas em cascata)
      await prisma.room.delete({
        where: { id: roomId }
      });

      res.status(200).json({
        success: true,
        message: 'Sala deletada com sucesso',
        data: {
          deletedRoom: {
            id: existingRoom.id,
            name: existingRoom.name,
            description: existingRoom.description
          }
        }
      });
    } catch (error) {
      console.error('Erro ao deletar sala:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao deletar sala',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}
