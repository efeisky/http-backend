import fs from "fs";
import readline from "readline";

export abstract class FileService {
    
    static async readFile(filePath: string, email : string, city : string, country : string, link?: string): Promise<string> {
        const fileStream = fs.createReadStream(filePath, 'utf-8');
    
        let fileContent = '';
        const currentDate = new Date();
    
        const processLineByLine = async (readStream: fs.ReadStream, callback: (content: string) => void) => {
    
            const rl = readline.createInterface({
                input: readStream,
                output: undefined
            });
    
            for await (const line of rl) {
                const variableRegex = /\$(\w+)\$/g;
                let modifiedLine = line;
                let match;
    
                while ((match = variableRegex.exec(line)) !== null) {
                    const variable = match[1];
                    modifiedLine = await FileService.switchVariables(variable, link || '', modifiedLine, match, email, city, country, currentDate);
                }
                callback(modifiedLine + '\n');
            }
    
            callback('');
        };
        
        await processLineByLine(fileStream, (line) => {
            fileContent += line;
        });
    
        return fileContent;
      }

      private static async switchVariables(variable: string,link : string, modifiedLine: string, match: RegExpExecArray, email : string, city : string, country : string, currentDate: Date) {
        switch (variable) {
            case 'email':
                modifiedLine = modifiedLine.replace(match[0], email);
                break;
            case 'date':
                modifiedLine = modifiedLine.replace(match[0], new Intl.DateTimeFormat('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }).format(currentDate));
                break;
            case 'city':
                modifiedLine = modifiedLine.replace(match[0], city);
                break;
            case 'country':
                modifiedLine = modifiedLine.replace(match[0], country);
                break;
            case 'link':
                modifiedLine = modifiedLine.replace(match[0], link);
                break;
            default:
                break;
        }
        return modifiedLine;
    }
}
