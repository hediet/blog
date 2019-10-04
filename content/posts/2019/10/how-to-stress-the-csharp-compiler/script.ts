const machine = {
    "0": {
        "0": { write: "1", move: "r", next: "1", halt: false },
        "1": { write: "1", move: "l", next: "1", halt: false }
    },
    "1": {
        "0": { write: "1", move: "l", next: "0", halt: false },
        "1": { write: "0", move: "l", next: "2", halt: false }
    },
    "2": {
        "0": { write: "1", move: "r", next: "2", halt: true },
        "1": { write: "1", move: "l", next: "3", halt: false }
    },
    "3": {
        "0": { write: "1", move: "r", next: "3", halt: false },
        "1": { write: "0", move: "r", next: "0", halt: false }
    }
};

let r = "";

function state(id: string): string {
    return `State${id}`;
}
function char(id: string): string {
    return `Char${id}`;
}

const defaultChar = "0";
for (const [curState, value] of Object.entries(machine)) {
    for (const [c, instr] of Object.entries(value)) {
        let p: {
            args: string[];
            left: string;
            right: string;
            newLeft: string;
            newRight: string;
            newChar: string;
        };
        const TRightStack = "TRightStack";
        const TLeftStack = "TLeftStack";
        const TItem = "TItem";
        const nextChar = instr.write;
        if (instr.move === "l") {
            p = {
                args: [TRightStack, TLeftStack, TItem],
                left: `Stack<${TItem}, ${TLeftStack}>`,
                right: TRightStack,
                newLeft: TLeftStack,
                newChar: TItem,
                newRight: `Stack<${char(nextChar)}, ${TRightStack}>`
            };
        } else if (instr.move === "r") {
            p = {
                args: [TRightStack, TLeftStack, TItem],
                left: TLeftStack,
                right: `Stack<${TItem}, ${TRightStack}>`,
                newLeft: `Stack<${char(nextChar)}, ${TLeftStack}>`,
                newChar: TItem,
                newRight: TRightStack
            };
        } else if (instr.move === "_") {
            p = {
                args: [TRightStack, TLeftStack, TItem],
                left: TLeftStack,
                right: TRightStack,
                newLeft: TLeftStack,
                newChar: char(nextChar),
                newRight: TRightStack
            };
        }

        let inputType = `Machine<${state(curState)}, ${p.left}, ${char(c)}, ${
            p.right
        }>`;
        let resultType = `Machine<${state(instr.next)}, ${p.newLeft}, ${
            p.newChar
        }, ${p.newRight}>`;
        let result = `new M2${resultType.substr("Machine".length)}()`;

        if (instr.halt) {
            resultType = "Secret";
            result = "new Secret()";
        }

        r += `public static ${resultType} Step<${TRightStack}, ${TLeftStack}, ${TItem}>(this ${inputType} m) { return ${result}; }\n`;
    }
}

console.log(r);
