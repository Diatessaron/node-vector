import { VectorService } from "./VectorService";

function init() {
    const args = process.argv.slice(2);
    let path: string;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "--path":
            case "-p":
                if (args[i + 1]) {
                    path = args[i + 1];
                    i++;
                } else {
                    console.error("Error: --path or -p option requires a value.");
                    process.exit(1);
                }
                break;
            default:
                console.warn(`Warning: Unknown argument "${args[i]}" ignored.`);
                break;
        }
    }

    return path;
}

const path = init();

new VectorService().vectorize(path)
