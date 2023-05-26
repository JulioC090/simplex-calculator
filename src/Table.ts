export class Table {
  private element: HTMLElement | null;
  private content: Array<Array<string>>;
  private table: HTMLElement;

  constructor(id: string, content: Array<Array<string>>) {
    this.element = document.getElementById(id);
    if (!this.element) {
      throw new Error(`Table: no element was found with id '${id}'`);
    }
    this.content = content;
    this.table = document.createElement('table');

    const div = document.createElement('div');
    div.classList.add('table');
    div.append(this.table);

    this.element.append(div);
    this.render();
  }

  public setContent(content: Array<Array<string>>) {
    this.content = content;
    this.render();
  }

  private render() {
    this.table.innerHTML = '';
    const header = document.createElement('tr');
    this.content.shift()?.map((value) => {
      const cell = document.createElement('th');
      cell.innerText = value;
      header.append(cell);
    });
    this.table.append(header);
    this.content.map((line) => {
      const lineElement = document.createElement('tr');
      line.map((value) => {
        const cell = document.createElement('td');
        cell.innerText = value;
        lineElement.append(cell);
      });
      this.table.append(lineElement);
    });
  }
}
