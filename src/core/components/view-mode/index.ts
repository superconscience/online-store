import { PageIds } from '../../../utils/constants';
import { queryHelper } from '../../../utils/functions';
import Component from '../../templates/components';

const viewModeClassName = 'view-mode';
const viewModeButtonClassName = `${viewModeClassName}__button`;

class ViewMode extends Component {
  static readonly classes = {
    viewMode: viewModeClassName,
    button: viewModeButtonClassName,
    big: `${viewModeButtonClassName}_big`,
    small: `${viewModeButtonClassName}_small`,
    active: `${viewModeButtonClassName}_active`,
    dot: `${viewModeClassName}__dot`,
  };

  constructor() {
    super('div', ViewMode.classes.viewMode);
  }

  build() {
    const query = queryHelper();
    const $fragment = document.createDocumentFragment();
    const $big = document.createElement('div');
    const $small = document.createElement('div');
    const $dotBig = document.createElement('div');
    const $dotSmall = document.createElement('div');

    $big.className = `${ViewMode.classes.button} ${ViewMode.classes.big}`;
    $small.className = `${ViewMode.classes.button} ${ViewMode.classes.small}`;
    $dotBig.className = `${ViewMode.classes.dot} ${ViewMode.classes.dot}_big`;
    $dotSmall.className = `${ViewMode.classes.dot} ${ViewMode.classes.dot}_small`;

    if (query.get('big') === 'false') {
      $small.classList.add(ViewMode.classes.active);
    } else {
      $big.classList.add(ViewMode.classes.active);
    }

    $dotBig.textContent = '.';
    $dotSmall.textContent = '.';

    $big.append(
      ...Array(16)
        .fill(0)
        .map(() => $dotBig.cloneNode())
    );

    $small.append(
      ...Array(36)
        .fill(0)
        .map(() => $dotSmall.cloneNode())
    );

    $fragment.append($small, $big);

    this.container.addEventListener('click', (e) => {
      if (!(e.target instanceof HTMLElement)) {
        return;
      }

      const query = queryHelper();
      const button = e.target.closest(`.${ViewMode.classes.button}`);

      if (!(button instanceof HTMLElement)) {
        return;
      }
      query.set('big', String(button.classList.contains(ViewMode.classes.big)));
      query.apply(PageIds.MainPage);
    });

    return $fragment;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default ViewMode;
