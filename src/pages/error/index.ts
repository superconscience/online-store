import Page from '../../core/templates/page';

export const enum ErrorTypes {
  Error_404 = 404,
}

class ErrorPage extends Page {
  private errorType: ErrorTypes | string;

  constructor(id: string, errorType: ErrorTypes | string) {
    super();
    this.errorType = errorType;
  }

  build() {
    const $notFound = document.createElement('div');
    const $message = document.createElement('h1');

    $notFound.append($message);
    $notFound.className = 'not-found-page';

    $message.className = 'not-found-page__message';

    $message.textContent = `PAGE NOT FOUND (404)`;

    return $notFound;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default ErrorPage;
