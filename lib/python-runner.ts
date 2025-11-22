import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export interface PythonScriptResult {
  success: boolean;
  output: string;
  error?: string;
}

export async function runPythonScript(
  scriptName: string,
  args: string[] = []
): Promise<PythonScriptResult> {
  try {
    // Only run in development or when explicitly configured
    if (process.env.NODE_ENV === 'production' && !process.env.PYTHON_SCRIPTS_ENABLED) {
      return {
        success: false,
        output: '',
        error: 'Python scripts are not available in production. Please run them locally.',
      };
    }

    // Path to the scripts directory
    const scriptsDir = path.resolve(process.cwd(), '..', 'scripts');
    
    // Use system python or venv python if available
    const pythonPath = process.env.PYTHON_PATH || 'python3';
    
    // Build command
    const command = `cd ${scriptsDir} && ${pythonPath} ${scriptName} ${args.join(' ')}`;
    
    console.log('Running command:', command);
    
    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    return {
      success: true,
      output: stdout,
      error: stderr || undefined,
    };
  } catch (error: any) {
    console.error('Python script error:', error);
    return {
      success: false,
      output: '',
      error: error.message || 'Unknown error',
    };
  }
}

// Helper to parse Python output for progress updates
export function parsePythonOutput(output: string): {
  prospects_found?: number;
  progress?: string;
  error?: string;
} {
  const result: any = {};
  
  // Look for patterns in output
  const prospectsMatch = output.match(/(\d+) prospects/i);
  if (prospectsMatch) {
    result.prospects_found = parseInt(prospectsMatch[1]);
  }
  
  const progressMatch = output.match(/✅ (.*)/);
  if (progressMatch) {
    result.progress = progressMatch[1];
  }
  
  const errorMatch = output.match(/❌ (.*)/);
  if (errorMatch) {
    result.error = errorMatch[1];
  }
  
  return result;
}

