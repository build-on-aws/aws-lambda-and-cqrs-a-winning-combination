export interface IQueryHandler<TOperation, TResponse> {
  handle(operation: TOperation): Promise<TResponse>;
}
