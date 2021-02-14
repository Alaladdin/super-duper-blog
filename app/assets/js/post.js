{
  const getPostId = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
  };

  const getPostData = (postId) => {
    return fetch(`https://gorest.co.in/public-api/posts/${postId}`)
      .then((res) => res.json())
      .catch(console.error);
  };

  const getUserData = (userId) => {
    return fetch(`https://gorest.co.in/public-api/users/${userId}`)
      .then((res) => res.json())
      .catch(console.error);
  };

  const getCommentsData = (postId) => {
    return fetch(`https://gorest.co.in/public-api/comments?post_id=${postId}`)
      .then((res) => res.json())
      .catch(console.error);
  };

  const normalizeDate = (date) => new Date(date).toLocaleDateString('ru-RU');

  const renderPost = (postData, postAuthorData) => {
    const postTitle = document.querySelector('.post-content__title');
    const postBody = document.querySelector('.post-content__body');
    const postImage = document.querySelector('.post-content__img');
    const postCreatedAt = document.querySelector('.post-content__created-date');
    const postAuthor = document.querySelector('.post-content__author');

    postTitle.textContent = postData.title;
    postBody.textContent = postData.body;
    postCreatedAt.textContent = `Created: ${normalizeDate(postData.created_at)}`;
    postAuthor.textContent = `By ${postAuthorData.name}`;
    postImage.alt = postData.title;
  };

  const createComment = (commentData) => {
    const commentsContainer = document.querySelector('.comments');
    const commentCard = document.createElement('div');
    const commentCardHeader = document.createElement('div');
    const commentAuthor = document.createElement('a');
    const commentCardBody = document.createElement('div');
    const commentText = document.createElement('p');
    const commentCardFooter = document.createElement('div');
    const commentCreatedAt = document.createElement('small');
    const commentRating = document.createElement('small');

    commentCard.classList.add('card', 'mb-4', 'bg-dark', 'text-light');
    commentCardHeader.classList.add('card-header');
    commentAuthor.classList.add('text-light');
    commentCardBody.classList.add('card-body');
    commentText.classList.add('card-text');
    commentCardFooter.classList.add('card-footer', 'd-flex', 'justify-content-between');
    commentCreatedAt.classList.add('text-muted');
    commentRating.classList.add('text-muted');

    commentAuthor.textContent = commentData.name;
    commentCardBody.textContent = commentData.body;
    commentCreatedAt.textContent = normalizeDate(commentData.created_at);
    commentRating.textContent = `${commentData.id} upvotes`; // user id used like upvotes count

    commentAuthor.href = '#0';

    commentCardHeader.append(commentAuthor);
    commentCardBody.append(commentText);
    commentCardFooter.append(commentCreatedAt);
    commentCardFooter.append(commentRating);
    commentCard.append(commentCardHeader);
    commentCard.append(commentCardBody);
    commentCard.append(commentCardFooter);
    commentsContainer.append(commentCard);
  };

  const createCommentsMessage = (mess = 'No comments yet') => {
    const commentsTitle = document.querySelector('.comments__title');
    commentsTitle.classList.remove('d-none');
    commentsTitle.textContent = mess;
  };

  document.addEventListener('DOMContentLoaded', async () => {
    const postId = getPostId();
    if (typeof postId !== 'string') window.location.href = '/'; // 404 page not created(
    const postFetchData = await getPostData(postId);
    const { data: postData } = postFetchData;
    const { data: postAuthorData } = await getUserData(postData.user_id);
    const { data: commentsData } = await getCommentsData(postId);

    renderPost(postData, postAuthorData);
    if (commentsData.length > 0) {
      createCommentsMessage('Comments');
      commentsData.forEach(createComment);
    }
  });
}
