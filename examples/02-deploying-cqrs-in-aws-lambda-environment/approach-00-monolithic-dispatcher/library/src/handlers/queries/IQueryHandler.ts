export interface IQueryHandler<TOperation, TResponse> {
  handle(operation: TOperation): TResponse;
}
