const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

class HanoiTowers {
  config;
  state;

  constructor(options = {}) {
    this.config = {
      size: 5,
      moveDelayMs: 200,
      printAfterMoves: true
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
    // TODO size comparison
    // console.log(`A to len: ${this.state[toStack].length}`)
    // console.log(`A from len: ${this.state[fromStack].length}`)
    this.state[toStack].push(this.state[fromStack].pop());
    // console.log(`B to len: ${this.state[toStack].length}`)
    // console.log(`B from len: ${this.state[fromStack].length}`)

    if(this.config.printAfterMoves)
      this.print();

    if(this.config.moveDelayMs)
      await HanoiTowers._sleep(this.config.moveDelayMs);

    return true;
  }

  print() {
    const STACK_PADDING = 1;
    const STACK_HALF = this.config.size;
    const STACK_WIDTH = 1 + (2*this.config.size);

    let output = '';
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

        // if(stack != 2) {
        //   output += ' '.repeat(STACK_PADDING);
        // }
      }
      output += '\n';
    }
    output += '\n';

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

async function moveMultiple(game, numDiscs, from, to) {
  let other = 3 - (from + to); // black magic arithmetic to figure out other "safe" stack

  if(numDiscs == 1) {
    await game.move(from, to);
  } else if(numDiscs == 2) {
    await game.move(from, other);
    await game.move(from, to);
    await game.move(other, to);
  } else if(numDiscs == 3) {
    // move the 2 high stack from "from" to auxiliary "other stack", using "to" stack as auxiliary
    await game.move(from, to);
    await game.move(from, other);
    await game.move(to, other);
    
    // move the base piece to the destination
    await game.move(from, to);

    // "from" has now become the auxiliary "other" stack for the 2 high stack
    await game.move(other, from);
    await game.move(other, to);
    await game.move(from, to);
  }
}

async function main() {
  let towers = new HanoiTowers({
    size: 3
  });
  towers.print();
  
  // while(await towers.move(MIDDLE, LEFT));

  await moveMultiple(towers, 3, MIDDLE, LEFT);
}
main();