Behaviour.specify(
  "A.confirmation-link",
  "confirmation-link",
  0,
  function (element) {
    element.onclick = function () {
      const post = element.dataset.post;
      const href = element.dataset.url;
      const message = element.dataset.message;
      const type = element.dataset.confirmationType;

      const options = {
        title: message,
        post: post,
        action: href,
        type: type || "default",
      };

      showConfirmationModal(options);

      return false;
    };
  }
);
