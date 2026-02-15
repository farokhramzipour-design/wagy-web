export async function mockApi<T>(data: T, delay = 350): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return data;
}
