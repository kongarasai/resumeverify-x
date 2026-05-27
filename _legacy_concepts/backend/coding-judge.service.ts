// ResumeVerify X™ — Code Execution Service (Judge0 + Docker)
import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

const LANGUAGE_IDS: Record<string, number> = {
  python: 71, java: 62, 'c++': 54, c: 50,
  javascript: 63, typescript: 74, go: 60,
  rust: 73, kotlin: 78, swift: 83, php: 68, sql: 82,
};

@Injectable()
export class CodingJudgeService {
  private judge0Url = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';

  async submitCode(code: string, language: string, testCases: { input: string; expectedOutput: string }[]) {
    const langId = LANGUAGE_IDS[language.toLowerCase()] || 71;
    const results = [];

    for (const tc of testCases) {
      try {
        const submitRes = await axios.post(`${this.judge0Url}/submissions`, {
          source_code: Buffer.from(code).toString('base64'),
          language_id: langId,
          stdin: Buffer.from(tc.input).toString('base64'),
          expected_output: Buffer.from(tc.expectedOutput).toString('base64'),
          cpu_time_limit: 5,
          memory_limit: 256000,
        }, {
          headers: {
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
            'Content-Type': 'application/json',
          }
        });

        const token = submitRes.data.token;
        // Poll for result
        let result = null;
        for (let i = 0; i < 10; i++) {
          await new Promise(r => setTimeout(r, 500));
          const statusRes = await axios.get(`${this.judge0Url}/submissions/${token}`, {
            headers: { 'X-RapidAPI-Key': process.env.JUDGE0_API_KEY }
          });
          if (statusRes.data.status.id > 2) { result = statusRes.data; break; }
        }

        results.push({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: result ? Buffer.from(result.stdout || '', 'base64').toString() : '',
          passed: result?.status.id === 3,
          runtime: result?.time,
          memory: result?.memory,
          statusDescription: result?.status.description || 'Timeout',
        });
      } catch (err) {
        results.push({ input: tc.input, expectedOutput: tc.expectedOutput, passed: false, error: err.message });
      }
    }

    const passedCount = results.filter(r => r.passed).length;
    return {
      results,
      passedCount,
      totalCount: testCases.length,
      score: (passedCount / testCases.length) * 100,
      avgRuntime: results.map(r => r.runtime).filter(Boolean).reduce((a, b) => a + Number(b), 0) / results.length,
    };
  }

  async runCode(code: string, language: string, stdin: string = '') {
    const langId = LANGUAGE_IDS[language.toLowerCase()] || 71;
    const submitRes = await axios.post(`${this.judge0Url}/submissions?wait=true`, {
      source_code: Buffer.from(code).toString('base64'),
      language_id: langId,
      stdin: Buffer.from(stdin).toString('base64'),
    }, { headers: { 'X-RapidAPI-Key': process.env.JUDGE0_API_KEY } });

    return {
      output: submitRes.data.stdout ? Buffer.from(submitRes.data.stdout, 'base64').toString() : '',
      stderr: submitRes.data.stderr ? Buffer.from(submitRes.data.stderr, 'base64').toString() : '',
      runtime: submitRes.data.time,
      memory: submitRes.data.memory,
      status: submitRes.data.status.description,
    };
  }
}
