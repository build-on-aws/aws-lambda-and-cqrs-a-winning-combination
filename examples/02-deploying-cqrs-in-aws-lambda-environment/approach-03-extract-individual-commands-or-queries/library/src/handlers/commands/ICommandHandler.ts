export interface ICommandHandler<TOperation, TResponse> {
  handle(operation: TOperation): Promise<TResponse>;
}
