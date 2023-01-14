import Component from '../../templates/components';

class Footer extends Component {
  constructor() {
    super('footer', 'footer');
  }

  build(): HTMLDivElement {
    const $wrapper = document.createElement('div');
    const $cp = document.createElement('p');
    const $links = document.createElement('ul');

    $wrapper.className = 'footer__wrapper';

    $cp.className = 'copyright';
    $cp.textContent = 'Online Store 2022';

    $links.className = 'footer__links';
    $links.innerHTML =
      '' +
      `
        <li class="footer__links-item"><a class="footer__link" href="https://github.com/superconscience"><span class="icon icon_github"></span></a></li>
        <li class="footer__links-item"><a class="footer__link" href="https://github.com/Alex89198900"><span class="icon icon_github"></span></a></li>
        <li class="footer__links-item"><a class="footer__link" href="https://rs.school/js/"><span class="icon icon_rsschool"></span></a></li>
      `;

    $wrapper.append($cp, $links);

    return $wrapper;
  }

  render(): HTMLElement {
    this.container.append(this.build());
    return this.container;
  }
}

export default Footer;
