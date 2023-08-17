import { Component } from 'react';
import { Button } from './Button';
import { Gallery } from './Gallery';
import { Modal } from './Modal/Modal';
import { getTrendingMovies } from 'services/moviesAPI';
import { moviesMapper } from 'utils/moviesmapper.js';

export class App extends Component {
  state = {
    movies: [],
    isGalleryOpen: false,
    isLoading: false,
    page: 1,
    currentImg: null,
    error: null,
  };

  //first condition: Якщо стейт помінявся і при цьому помінявся на "Галерея відкрита",
  // то піди на бек енд за фільмами АБО сторінка помінялась та галея відкрита - те ж саме,
  // піди за фільмами
  componentDidUpdate(_, prevState) {
    const { isGalleryOpen, page } = this.state;
    if (
      (prevState.isGalleryOpen !== isGalleryOpen && isGalleryOpen) ||
      (prevState.page !== page && isGalleryOpen)
    ) {
      this.fetchMovies();
    }
    if (prevState.isGalleryOpen !== isGalleryOpen && !isGalleryOpen) {
      this.setState({ movies: [] });
    }
  }

  deleteMovie = movieId => {
    this.setState(prevState => ({
      movies: prevState.movies.filter(({ id }) => id !== movieId),
    }));
  };

  loadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };
  openModal = img => {
    this.setState({ currentImg: img });
  };

  closeModal = () => {
    this.setState({ currentImg: null });
  };
  // ця функція змінює стейт isGalleryOpen на протилежне
  toggleGallery = () => {
    this.setState(prevState => ({
      isGalleryOpen: !prevState.isGalleryOpen,
    }));
  };

  changeWatched = movieId => {
    this.setState(prevState => ({
      movies: prevState.movies.map(movie => {
        if (movie.id === movieId) {
          return { ...movie, watched: !movie.watched };
        }
        return movie;
      }),
    }));
  };

  fetchMovies = () => {
    const { page } = this.state;
    this.setState({ isLoading: true });
    // записали у стейт гарненько сформований обєкт із полями які нам потрібні
    getTrendingMovies(page).then(({ data: { results } }) =>
      this.setState(prevState => ({
        movies: [...prevState.movies, ...moviesMapper(results)],
      }))
        .catch(error => this.setState({ error: error.message }))
        .finally(() => {
          this.setState({ isLoading: false });
        })
    );
  };

  render() {
    const { movies, isGalleryOpen, currentImg } = this.state;
    return (
      <>
        <Button
          text={isGalleryOpen ? 'Hide movies' : 'Show movies'}
          handleClick={this.toggleGallery}
        />
        {isGalleryOpen && (
          <>
            <Gallery
              movies={movies}
              onDelete={this.deleteMovie}
              openModal={this.openModal}
              changeWatched={this.changeWatched}
            />
            <Button text="Load More" handleClick={this.loadMore} />
          </>
        )}
        {currentImg && (
          <Modal currentImg={currentImg} onClose={this.closeModal} />
        )}
      </>
    );
  }
}
