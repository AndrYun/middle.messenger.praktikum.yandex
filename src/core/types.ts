import type { Block, BlockProps } from "./Block";

export type BlockConstructor<P extends BlockProps = BlockProps> = new (
  props?: P
) => Block<P>;
