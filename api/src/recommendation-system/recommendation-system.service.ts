import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { spawn } from 'child_process';
import { join } from 'path';

@Injectable()
export class RecommendationSystemService {

    // @Interval(5000)
    // testCron() {
    //     const scriptPath = join(process.cwd(), 'src/recommendation-system/test.py');
    //     const script = spawn('python3', [scriptPath]);

    //     script.on('spawn', (code: number) => {
    //         console.log('Script started execution @' + scriptPath);
    //     });

    //     script.stdout.on('data', (data) => {
    //         console.log('Output from script:' + data);
    //     });

    //     script.on('exit', (code: number) => {
    //         console.log('Script exited with code: ' + code.toString());
    //     });
    // }
}
