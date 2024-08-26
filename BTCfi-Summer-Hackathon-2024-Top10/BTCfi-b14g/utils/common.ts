export const getErrorMessage = (error: unknown) => {
  let message = 'Something went wrong';
  if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object' && 'shortMessage' in error) {
    message = error.shortMessage as string;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = error.message as string;
  } else if (error instanceof Error) {
    message = error.message;
  }
  return message;
};

export function formatAmount(number: number, precision = 5) {
  return +number.toFixed(precision);
}
export function formatNumberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function response(data: any, statusCode = 200) {
  return new Response(JSON.stringify(data), {
    status: statusCode,
  });
}

export function errorResponse() {
  return new Response(JSON.stringify({ error: 'Something wrong!' }), {
    status: 500,
  });
}


export const convertRoundToDate = (round: string) => {
  const date = new Date(Number(round) * 1000 * 86400);
  // Format the date as desired
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return formattedDate
}
