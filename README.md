# Hanoi Towers

A little Node.js script to simulate the Hanoi Towers and demonstrate a recursive solver. I started making a visual version with HTML but it is incomplete.

## Example

```
async function main() {
  let towers = new HanoiTowers({
    size: 9,
    interactive: true,
    moveDelayMs: 3
  });
  towers.print();

  await towers.moveAll(MIDDLE, LEFT);
}
main();
```

