export const typeScriptFunc = `export function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}`;

const typeScriptSnippet = `
interface Person {
    firstName: string;
    lastName: string;
}
${typeScriptFunc}
`;

export default typeScriptSnippet;
