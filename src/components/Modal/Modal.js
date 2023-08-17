import { Component } from 'react';
import styles from './Modal.module.css';

export class Modal extends Component {
  closeByEsc = event => {
    if (event.code === 'Escape') {
      this.props.onClose();
    }
  };

  closeByBackdrop = (event) => {
    if(event.currentTarget === event.target){
      this.props.onClose();
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.closeByEsc);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeByEsc);
  }

  render() {
    const {
      currentImg: { src, alt },
      onClose,
    } = this.props;
    return (
      <div className={styles.backdrop} onClick={this.closeByBackdrop}>
        <div className={styles.modal}>
          <img src={`https://image.tmdb.org/t/p/w500${src}`} alt={alt} />
          <button className={styles.btnClose} type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }
}
