/**
 * ExpenseFlow API Service
 * Communicates with the FastAPI backend at http://127.0.0.1:8000
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Custom error class for API errors with HTTP status code and details
 */
export class ApiError extends Error {
  constructor(message, status = null, isCorsOrNetwork = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isCorsOrNetwork = isCorsOrNetwork;
  }
}

/**
 * Helper to safely handle fetch calls with proper timeout & error parsing
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}${endpoint}`;

  const defaultHeaders = {
    Accept: 'application/json',
  };

  if (options.body && typeof options.body === 'string') {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    // Network errors (FastAPI offline or CORS blocked)
    const isNetwork = err instanceof TypeError;
    const msg = isNetwork
      ? `Cannot connect to backend at ${BASE_URL}. Ensure FastAPI is running and CORS is enabled.`
      : err.message;
    throw new ApiError(msg, null, true);
  }

  // Handle 404 for specific endpoints if caller wants to handle it, but parse body first
  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let errorDetail = 'API request failed';
    if (data && typeof data === 'object') {
      if (typeof data.detail === 'string') {
        errorDetail = data.detail;
      } else if (Array.isArray(data.detail)) {
        // FastAPI validation errors
        errorDetail = data.detail
          .map((item) => `${item.loc?.slice(-1)[0] || 'field'}: ${item.msg}`)
          .join(', ');
      } else if (data.message) {
        errorDetail = data.message;
      }
    } else if (typeof data === 'string' && data.length > 0) {
      errorDetail = data;
    }

    throw new ApiError(
      errorDetail || `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }

  return data;
}

/**
 * Check backend status
 * GET /
 */
export async function checkApiStatus() {
  try {
    const data = await apiRequest('/');
    return { isOnline: true, data };
  } catch (err) {
    return {
      isOnline: false,
      error: err.message,
      isCorsOrNetwork: err.isCorsOrNetwork,
    };
  }
}

/**
 * Retrieve all expenses
 * GET /expenses
 */
export async function fetchExpenses() {
  const data = await apiRequest('/expenses');
  if (!Array.isArray(data)) {
    return [];
  }
  return data;
}

/**
 * Retrieve one expense by ID
 * GET /expenses/{id}
 */
export async function fetchExpenseById(expenseId) {
  if (!expenseId) {
    throw new Error('Expense ID is required');
  }
  return await apiRequest(`/expenses/${expenseId}`);
}

/**
 * Retrieve the highest expense
 * GET /expenses/highest
 * Returns null if status is 404 (i.e. no expenses created yet)
 */
export async function fetchHighestExpense() {
  try {
    return await apiRequest('/expenses/highest');
  } catch (err) {
    if (err.status === 404) {
      return null;
    }
    throw err;
  }
}

/**
 * Create a new expense
 * POST /expenses
 * @param {{ title: string, amount: number, category: string }} expenseData
 */
export async function createExpense(expenseData) {
  const payload = {
    title: expenseData.title.trim(),
    amount: Number(expenseData.amount),
    category: expenseData.category.trim(),
  };

  if (expenseData.created_at) {
    payload.created_at = expenseData.created_at;
  }

  return await apiRequest('/expenses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Update an existing expense
 * PUT /expenses/{id}
 * @param {number|string} expenseId
 * @param {{ title: string, amount: number, category: string, created_at?: string }} expenseData
 */
export async function updateExpense(expenseId, expenseData) {
  if (!expenseId) {
    throw new Error('Expense ID is required for update');
  }

  const payload = {
    title: expenseData.title.trim(),
    amount: Number(expenseData.amount),
    category: expenseData.category.trim(),
  };

  if (expenseData.created_at) {
    payload.created_at = expenseData.created_at;
  }

  return await apiRequest(`/expenses/${expenseId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}


/**
 * Delete an expense by ID
 * DELETE /expenses/{id}
 * @param {number|string} expenseId
 */
export async function deleteExpense(expenseId) {
  if (!expenseId) {
    throw new Error('Expense ID is required for deletion');
  }

  return await apiRequest(`/expenses/${expenseId}`, {
    method: 'DELETE',
  });
}

export const API_BASE_URL = BASE_URL;
