import { execFile } from 'child_process';
import { DateTimeProps } from '../../interfaces/DateTimeUTC';
import path from 'path';


function runPythonScript(arg: string, lat: string, lon: string, datetime:DateTimeProps): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../../../astro-finding.py');
    execFile(
      'python3',
      [scriptPath, arg, lat, lon, datetime.yearUTC, datetime.monthUTC, datetime.dayUTC,datetime.hourUTC, datetime.minuteUTC, datetime.secondUTC],
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

export const getCoordinates = async (arg:string, lat:string, lon: string, datetime:DateTimeProps) => {
 try {
    const result = await runPythonScript(arg, lat, lon, datetime);
    return result
  } catch (error) {
    console.error(error);
  }
}