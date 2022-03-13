export class LabelUtils {
  public static get(labelArrays: string[][], key: string): string {
    return labelArrays.filter((item: string[]) => item[0] === key)[0][1];
  }

  public static getMap(labelArrays: string[][]): Map<string, string> {
    const labelMap = new Map();
    labelArrays.forEach((item: string[]) => labelMap.set(item[0], item[1]));
    return labelMap;
  }
}
