import { FirestoreService, queryConstraints } from './firestore-services';
import type { Contrato } from './types';

// Contrato service using the generic FirestoreService
export class ContratosService extends FirestoreService<Contrato> {
  constructor() {
    super('contratos');
  }

  // Get contratos by user ID
  async getByUserId(userId: string): Promise<(Contrato & { id: string })[]> {
    return this.query([
      queryConstraints.where('userId', '==', userId),
      queryConstraints.orderBy('createdAt', 'desc')
    ]);
  }

  // Create a new contrato
  async createContrato(titulo: string, descricao: string, userId: string): Promise<string> {
    return this.create({
      titulo,
      descricao,
      userId,
      displayedOnTV: false
    });
  }

  // Get all contratos (for admin/diretoria role)
  async getAllContratos(): Promise<(Contrato & { id: string })[]> {
    return this.query([
      queryConstraints.orderBy('createdAt', 'desc')
    ]);
  }
}

// Export a singleton instance
export const contratosService = new ContratosService();