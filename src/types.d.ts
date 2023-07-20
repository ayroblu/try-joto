declare module 'joto-api' {
  export function login(username: string, password: string): Promise<void>;
  export function selectJoto(jotoId?: string): Promise<{jotoId: string}>;
  export function drawSVG(svg: string, jotoId?: string | null): Promise<{jotId: string}>;
}
