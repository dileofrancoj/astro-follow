import { execFile } from 'child_process';
import path from 'path';

function runPythonScript(arg: string, lat: string, lon: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../../../astro-finding.py');

    execFile(
      'python3',
      [scriptPath, arg, lat, lon],
      {},
      (error, stdout, stderr) => {
        if (error) {
          reject(`Error ejecutando script Python: ${error.message}`);
          return;
        }
        if (stderr) {
          console.warn('Warning (stderr) del script Python:', stderr);
        }
        resolve(stdout.trim());
      }
    );
  });
}

// Ejemplo de uso:
export const getCoordinates = async (arg:string, lat:string, lon: string) => {
 try {
    const result = await runPythonScript(arg, lat, lon);
    return result
  } catch (error) {
    console.error(error);
  }
}