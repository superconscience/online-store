abstract class Page {
  protected container: DocumentFragment;
  static TextObject = {};

  constructor() {
    this.container = document.createDocumentFragment();
  }

  protected createHeaderTitle(text: string) {
    const headerTitle = document.createElement('h1');
    headerTitle.innerText = text;
    return headerTitle;
  }

  render() {
    return this.container;
  }

  query() {}
}

export default Page;
