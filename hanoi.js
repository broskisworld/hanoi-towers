const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

class HanoiTowers {
  config;
  state;
  moveCt = 0;

  constructor(options = {}) {
    this.config = {
      size: 5,
      title: 'Towers of Hanoi',
      interactive: true,
      printTitle: true,
      moveDelayMs: 200
    }

    Object.keys(options).forEach((key) => this.config[key] = options[key]);

    this._init();
  }

  async move(fromStack, toStack) {
    if(this.state[fromStack].length <= 0) {
      console.log(`stack ${fromStack} has too small of length (${this.state[fromStack].length})`);
      return false;
    }
    if(this.state[toStack].length > 0 && this.state[fromStack].slice(-1) > this.state[toStack].slice(-1)) {
      console.log(`disc of size ${this.state[fromStack].slice(-1)} from stack ${fromStack} cannot go on stack ${toStack} of size ${this.state[toStack].slice(-1)}`);
      return false;
    }
    this.state[toStack].push(this.state[fromStack].pop());

    if(this.config.interactive) {
      this.print();
      if(this.config.moveDelayMs)
        await HanoiTowers._sleep(this.config.moveDelayMs);
    }

    this.moveCt++;

    return true;
  }

  async moveAll(from, to) {
    await this.moveMultiple(this.state[from].length, from, to);
  }

  async moveMultiple(numDiscs, from, to) {
    let other = 3 - (from + to); // black magic arithmetic to figure out other "safe" stack
  
    if(numDiscs == 1) {
      await this.move(from, to);
    } else {
      // move the 2 high stack from "from" to auxiliary "other stack", using "to" stack as auxiliary
      await this.moveMultiple(numDiscs - 1, from, other)
      
      // move the base piece to the destination
      await this.move(from, to);
  
      // "from" has now become the auxiliary "other" stack for the 2 high stack
      await this.moveMultiple(numDiscs - 1, other, to)
    }
  }

  print() {
    const STACK_PADDING = 1;
    const STACK_HALF = this.config.size;
    const STACK_WIDTH = 1 + (2*this.config.size);
    const PRINT_WIDTH = STACK_WIDTH + 1 + STACK_WIDTH + 1 + STACK_WIDTH;

    let output = '';

    if(this.config.printTitle) {
      output += ' '.repeat((PRINT_WIDTH - this.config.title.length) / 2);
      output += this.config.title;
      output += ' '.repeat((PRINT_WIDTH - this.config.title.length) / 2);
      output += '\n';
    }
    output += '\n';

    for(let i = this.config.size; i > -1; i--) {
      for(let stack = 0; stack < 3; stack++) {
        let discSize = this.state[stack][i];

        if(this.state[stack].length > i) {

          output += ' '.repeat(STACK_HALF - discSize);
          output += '='.repeat(discSize);
          output += 'H';
          output += '='.repeat(discSize);
          output += ' '.repeat(STACK_HALF - discSize);
          
        } else {
          output += ' '.repeat(STACK_HALF);
          output += 'H';
          output += ' '.repeat(STACK_HALF);
        }

        if(stack != 2) {
          output += ' '.repeat(STACK_PADDING);
        }
      }
      output += '\n';
    }
    output += 'H'.repeat(STACK_WIDTH);
    output += ' ';
    output += 'H'.repeat(STACK_WIDTH);
    output += ' ';
    output += 'H'.repeat(STACK_WIDTH);
    output += '\n';
    output += `Size: ${this.config.size}  Step: ${String(this.moveCt).padStart(2)}`;

    console.log('\n'.repeat(40));
    console.log(output);
  }

  async getStackTop(stack) {

  }

  _init() {
    this.state = [[], [], []];

    for(let i = this.config.size; i > 0; i--) {
      this.state[MIDDLE].push(i);
    }
  }

  static _sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    })
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

async function main() {
  let towers = new HanoiTowers({
    size: 9,
    moveDelayMs: 3
  });
  towers.print();
  
  // while(await towers.move(MIDDLE, LEFT));

  await towers.moveAll(MIDDLE, LEFT);
}
main();