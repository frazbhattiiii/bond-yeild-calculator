import { apiClient } from '@/services/api-client.service';
import type {
  BondCalculationRequest,
  BondCalculationResponse,
} from '@/types/bond.types';

const BOND_CALCULATE_PATH = '/bond/calculate';

export async function calculateBondYield(
  bondRequest: BondCalculationRequest,
): Promise<BondCalculationResponse> {
  const axiosResponse = await apiClient.post<BondCalculationResponse>(
    BOND_CALCULATE_PATH,
    bondRequest,
  );
  return axiosResponse.data;
}
