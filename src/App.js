import React from "react";
import "./App.css";
import axios from "axios";
import Searchbar from "./components/Searchbar/Searchbar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import Button from "./components/Button/Button";
import Modal from "./components/Modal/Modal";
import Loader from "./components/Loader/Loader";
class App extends React.Component {
  state = {
    images: [],
    isLoading: false,
    searchQuery: "",
    page: 1,
    total: 0,
    showModal: false,
    largeImageURL: "",
  };

  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevState.searchQuery;
    const nextQuery = this.state.searchQuery;
    if (prevQuery !== nextQuery) {
      this.handleSubmit();
    }
  }
  handleSubmit = () => {
    this.setState({ isLoading: true });
    axios
      .get(
        `https://pixabay.com/api/?q=${this.state.searchQuery}&page=${this.state.page}&key=16352772-b16829ab3ccec13084c19ab04&image_type=photo&orientation=horizontal&per_page=15`
      )
      .then((response) => {
        this.setState((prevState) => {
          return {
            images: [...prevState.images, ...response.data.hits],
            isLoading: false,
            page: prevState.page + 1,
            total: response.data.total,
          };
        });
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      });
  };
  handleSearchFormSubmit = (query) => {
    this.setState({ searchQuery: query, page: 1, images: [] });
  };

  toggleModal = () => {
    this.setState((prevState) => {
      return {
        showModal: !prevState.showModal,
      };
    });
  };
  openModal = (largeImageURL) => {
    this.setState({ largeImageURL: largeImageURL });
    this.toggleModal();
  };

  render() {
    const { images, isLoading, showModal, largeImageURL, total } = this.state;
    return (
      <div>
        <Searchbar submit={this.handleSearchFormSubmit} />
        {images.length > 0 && (
          <ImageGallery onClick={this.openModal} images={images} />
        )}
        {showModal && (
          <Modal
            largeImageURL={largeImageURL}
            onClose={this.toggleModal}
          ></Modal>
        )}
        {isLoading && <Loader />}
        {images.length > 0 && !isLoading && total !== images.length && (
          <Button loadMore={this.handleSubmit} />
        )}
      </div>
    );
  }
}

export default App;
