declare module 'joto-api' {
  export function login(username: string, password: string): Promise<void>;
  export function selectJoto(): Promise<void>;
  export function drawSVG(string): Promise<void>;
}
