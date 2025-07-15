import { Request, Response } from 'express';
import prisma from '../config/prismaClient';
import { AuthenticatedRequest } from '../types/auth';

export class ReservationsController {
  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { roomId, date, startTime, endTime, reason } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
    res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    return;
    }
      if (!roomId || !date || !startTime || !endTime) {
        res.status(400).json({
          success: false,
          message: 'Todos os campos obrigatórios devem ser preenchidos.',
        });
        return;
      }
      
      const conflito = await prisma.reservation.findFirst({
        where: {
          roomId: parseInt(roomId),
          date: new Date(date),
          startTime: startTime,
          status: { in: ['APPROVED', 'PENDING'] },
        },
      });

      if (conflito) {
        res.status(409).json({
          success: false,
          message: 'Já existe uma reserva para essa sala neste horário.',
        });
        return;
      }

      const reserva = await prisma.reservation.create({
        data: {
          roomId: parseInt(roomId),
          userId: userId,
          date: new Date(date),
          startTime,
          endTime,
          reason: reason || null,
          status: 'APPROVED',
        },
      });

      res.status(201).json({
        success: true,
        message: 'Reserva criada com sucesso!',
        data: reserva,
      });
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno ao criar reserva.',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }

  static async updateDate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { newDate } = req.body;
      const userId = req.user?.userId;

      const reserva = await prisma.reservation.findUnique({
        where: { id: parseInt(id) },
      });

      if (!reserva) {
        res.status(404).json({ success: false, message: 'Reserva não encontrada.' });
        return;
      }

      if (reserva.userId !== userId) {
        res.status(403).json({ success: false, message: 'Você não tem permissão para alterar esta reserva.' });
        return;
      }

      const novaData = new Date(newDate);
      const hoje = new Date();

      if (novaData <= hoje) {
        res.status(400).json({ success: false, message: 'A nova data deve ser futura.' });
        return;
      }

      const conflito = await prisma.reservation.findFirst({
        where: {
          roomId: reserva.roomId,
          date: novaData,
          startTime: reserva.startTime,
          status: { in: ['APPROVED', 'PENDING'] },
          NOT: { id: reserva.id },
        },
      });

      if (conflito) {
        res.status(409).json({
          success: false,
          message: 'Conflito de horário: já existe uma reserva para essa sala neste horário.',
        });
        return;
      }

      const reservaAtualizada = await prisma.reservation.update({
        where: { id: parseInt(id) },
        data: { date: novaData },
      });

      res.status(200).json({
        success: true,
        message: 'Data da reserva atualizada com sucesso!',
        data: reservaAtualizada,
      });
    } catch (error) {
      console.error('Erro ao atualizar data da reserva:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno ao atualizar reserva.',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }

  static async cancel(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const reserva = await prisma.reservation.findUnique({
        where: { id: parseInt(id) },
      });

      if (!reserva) {
        res.status(404).json({ success: false, message: 'Reserva não encontrada.' });
        return;
      }

      if (reserva.userId !== userId) {
        res.status(403).json({ success: false, message: 'Você não tem permissão para cancelar esta reserva.' });
        return;
      }

      const hoje = new Date();
      const dataReserva = new Date(reserva.date);

      if (dataReserva <= hoje) {
        res.status(400).json({ success: false, message: 'Não é possível cancelar uma reserva passada ou do mesmo dia.' });
        return;
      }

      if (reserva.status === 'REJECTED') {
        res.status(409).json({ success: false, message: 'Essa reserva já foi cancelada.' });
        return;
      }

      const reservaCancelada = await prisma.reservation.update({
        where: { id: parseInt(id) },
        data: { status: 'REJECTED' },
      });

      res.status(200).json({
        success: true,
        message: 'Reserva cancelada!',
        data: reservaCancelada,
      });
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno ao cancelar reserva.',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
}
