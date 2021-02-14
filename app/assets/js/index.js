{
  const getBlogPage = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page = urlParams.get('page');
    return (page > 0) ? page : 1;
  };

  const getBlogData = (page = 1) => {
    return fetch(`https://gorest.co.in/public-api/posts?page=${page}`)
      .then((res) => res.json())
      .catch(console.error);
  };

  const getLimitedString = (string, wordsCount, endDots = false) => {
    return string.split(' ').slice(0, wordsCount).join(' ') + (endDots && '...');
  };

  const normalizeDate = (date) => new Date(date).toLocaleDateString('ru-RU');

  const createPost = (postData) => {
    const postsContainer = document.querySelector('.blog-posts');
    const post = document.createElement('div');
    const cardContainer = document.createElement('div');
    const cardImage = document.createElement('img');
    const cardBody = document.createElement('div');
    const cardFooter = document.createElement('div');
    const postTitle = document.createElement('h3');
    const cardText = document.createElement('p');
    const createdAt = document.createElement('div');
    const updatedAt = document.createElement('small');
    const moreLink = document.createElement('a');

    const postDataId = postData.id;
    const postDataTitle = getLimitedString(postData.title, 5);

    const createdAtDate = normalizeDate(postData.created_at);
    const updatedAtDate = normalizeDate(postData.updated_at);

    post.classList.add('col-12', 'col-sm-6', 'col-lg-4', 'mb-4');
    cardContainer.classList.add('card');
    cardBody.classList.add('card-body');
    cardFooter.classList.add('card-footer');
    cardImage.classList.add('card-image-top');
    postTitle.classList.add('card-title');
    cardText.classList.add('card-text');
    createdAt.classList.add('mb-2', 'text-muted');
    updatedAt.classList.add('text-muted');
    moreLink.classList.add('btn', 'btn-secondary');

    postTitle.textContent = postDataTitle;
    createdAt.textContent = createdAtDate;
    updatedAt.textContent = `Last update: ${updatedAtDate}`;
    cardText.textContent = getLimitedString(postData.body, 15, true);
    moreLink.textContent = 'read more';

    moreLink.href = `post.html?id=${postDataId}`;
    cardImage.src = `https://source.unsplash.com/300x200?sig=${postDataId}`;
    cardImage.alt = postDataTitle;

    cardFooter.append(updatedAt);
    cardBody.append(postTitle);
    cardBody.append(createdAt);
    cardBody.append(cardText);
    cardBody.append(moreLink);
    cardContainer.append(cardImage);
    cardContainer.append(cardBody);
    cardContainer.append(cardFooter);
    post.append(cardContainer);
    postsContainer.append(post);
  };

  const createPagination = (paginationData) => {
    const nextBtn = document.querySelector('.pagination__item-next');
    const currentPage = paginationData.page;
    const totalPages = paginationData.pages;

    // pagination link getter function
    const getPaginationLink = (page) => ((page === 1) ? '/' : `/?page=${page}`);

    // enable prev link
    if (currentPage > 1) {
      const prevBtn = document.querySelector('.pagination__item-prev');
      const prevLink = document.querySelector('.pagination__prev');
      prevBtn.classList.remove('disabled');
      prevLink.href = getPaginationLink(currentPage - 1);
    }

    // enable next link
    if (currentPage < totalPages) {
      const nextLink = document.querySelector('.pagination__next');
      nextBtn.classList.remove('disabled');
      nextLink.href = getPaginationLink(currentPage + 1);
    }

    for (let i = currentPage - 3; i <= currentPage + 3; i += 1) {
      if (i <= 0 || totalPages < i) continue; // skip iteration
      const paginationItem = document.createElement('li');
      const paginationLink = document.createElement('a');
      const pageLink = getPaginationLink(i);

      // make current page link active
      if (currentPage === i) paginationItem.classList.add('active');

      paginationItem.classList.add('page-item');
      paginationLink.classList.add('page-link');

      paginationLink.href = pageLink;
      paginationLink.textContent = i;

      paginationItem.append(paginationLink);
      nextBtn.insertAdjacentElement('beforebegin', paginationItem);
    }
  };

  document.addEventListener('DOMContentLoaded', async () => {
    const blogPage = getBlogPage();
    const blogData = await getBlogData(blogPage);
    const { data: posts, meta } = blogData;

    posts.forEach(createPost);
    createPagination(meta.pagination);
  });
}
