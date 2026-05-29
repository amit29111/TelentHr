import apiClient from '../api/apiClient';
import {ENDPOINT} from '../api/endpoint';

export const toLongFinancialYear = value => {
  if (!value) return '';
  const s = String(value);
  const shortMatch = s.match(/^(\d{4})-(\d{2})$/);
  if (shortMatch) {
    return `${shortMatch[1]}-20${shortMatch[2]}`;
  }
  return s;
};

export const fyQueryVariants = value => {
  const long = toLongFinancialYear(value);
  const m = long.match(/^(\d{4})-(\d{4})$/);
  const short = m ? `${m[1]}-${m[2].slice(-2)}` : value;
  return [...new Set([long, short, value].filter(Boolean))];
};

const extractAnnualList = payload => {
  if (!payload) return [];
  const root = payload?.data ?? payload;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.data)) return root.data;
  for (const key of [
    'annualStatements',
    'statements',
    'salaryStatements',
    'list',
    'records',
  ]) {
    if (Array.isArray(root?.[key])) return root[key];
  }
  if (root && typeof root === 'object' && !Array.isArray(root)) {
    if (root._id || root.id || root.statementId) return [root];
  }
  return [];
};

export const resolveAnnualStatementId = async financialYear => {
  for (const fy of fyQueryVariants(financialYear)) {
    try {
      const res = await apiClient.get(
        ENDPOINT.PAYROLL.ANNUAL_SALARY_STATEMENT(fy),
      );
      const list = extractAnnualList(res?.data ?? {});
      const first = list.find(
        item => item?._id || item?.id || item?.statementId,
      );
      if (first) {
        return first._id || first.id || first.statementId;
      }
    } catch (_) {
      // try next FY format
    }
  }
  return null;
};
