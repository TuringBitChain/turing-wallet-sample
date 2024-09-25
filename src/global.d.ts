import { TuringProvider } from "./hooks/useTuringWallet";

declare global {
  interface Window {
    Turing: TuringProvider;
  }
}
