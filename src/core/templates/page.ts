abstract class Page {
  protected container: DocumentFragment;
  static TextObject = {};

  constructor() {
    this.container = document.createDocumentFragment();
  }

  protected createHeaderTitle(text: string): HTMLHeadingElement {
    const headerTitle = document.createElement('h1');
    headerTitle.innerText = text;
    return headerTitle;
  }

  render(): DocumentFragment {
    return this.container;
  }

  query(): void {}
}

export default Page;
