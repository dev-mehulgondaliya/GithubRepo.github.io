

$(document).ready(async function () {

    let repoName = 'johnpapa';
    let currentPage = 1;
    let totalpages;
    let sort = 'desc';
    let itemsPerPage = $('#number_of_repo').text();

    // search repo
    $('#userSearchbtn').on('click', function () {
        repoName = $('#userSearch').val()
        fetchData(repoName);
        fetchRepoData(repoName, itemsPerPage, 1, sort);
        fetchRepoDataCount()
        $('#userSearch').val("")
    });



    // profile show
    async function fetchData(username) {
        $('#user_profile_img').addClass('skeleton-circle')
        $('#user_name,#user_bio,#user_location,#twitter,#github').addClass('skeleton-loader')

        try {
            const response = await fetch(`https://api.github.com/users/${username}`);

            if (response.ok) {
                const data = await response.json();
                // console.log('Fetched data with Fetch API:', data);

                $('#user_profile_img').attr('src', `${data.avatar_url}`);
                $('#user_name').text(`${data.name}`)
                $('#user_bio').text(data.bio !== null && data.bio !== 'null' ? data.bio : 'No bio available');

                if (data.location !== null || data.location !== 'null') {
                    $('#user_location').html(`
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${data.location}</span>
                    `)
                }
                if (data.html_url !== null || data.html_url !== 'null') {
                    $('#user_github').text(`${data.html_url}`)
                    $('#user_github_link').attr('href', `${data.html_url}`)
                    $('.fa-github').show()
                }

                if (data.twitter_username && data.twitter_username !== null && data.twitter_username !== 'null') {
                    $('#user_twitter').text(`https://twitter.com/${data.twitter_username}`);
                    $('#twitter_link').attr('href', `https://twitter.com/${data.twitter_username}`);
                    $('.fa-x-twitter').show()
                }

                $('#user_profile_img').removeClass('skeleton-circle')
                $('#user_name,#user_bio,#user_location,#twitter,#github').removeClass('skeleton-loader')

            } else {
                throw new Error('Network response was not ok');
            }

        } catch (error) {
            console.error('Error fetching data with Fetch API:', error);
        }
    }

    fetchData(repoName);

    // repo show
    async function fetchRepoData(repoName, perpage, page, sort) {
        $('#spinner_loader').show();
        $('#repo_showcase').html('');
        // $('#repo_showcase').addClass('skeleton-loader');
        $('#filter,#pagination-container').hide()

        try {
            const response = await fetch(`https://api.github.com/users/${repoName}/repos?page=${page}&per_page=${perpage}&sort=updated&direction=${sort}`);

            if (response.ok) {
                const data = await response.json();
                // console.log('Fetched data with Fetch API:', data);
                if (data) {



                    data.forEach(function (repository) {
                        const inputDate = new Date(repository.updated_at);
                        const options = {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            timeZone: 'UTC', // Adjust the time zone as needed
                        };

                        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(inputDate);
                        $('#repo_showcase').append(`
                            <div class="col-12 p-1">
                                <div class="border border-1 rounded  p-2">
                                    <a href="https://github.com/${repoName}/${repository.name}" target="_blank" class="text-primary reponame text-wrap text-break">${repository.name}</a>
                                    <p class="d-flex gap-1 align-items-center text-secondary-emphasis">Update at ${formattedDate}</p>
                                    <p>${repository.description !== null && repository.description !== 'null' ? repository.description : ''}</p>
                                    <div class="d-flex flex-wrap gap-2">
                                    ${repository.topics.map(topic => `
                                        <button class="bg-info rounded-pill border-0 text-white p-2">${topic}</button>
                                    `).join('')}
                                    </div>
                                </div>
                            </div>
                        `);
                    });
                }


                $('#spinner_loader').hide();
                // $('#repo_showcase').removeClass('skeleton-loader');
                $('#filter,#pagination-container').show();


            } else {
                throw new Error('Network response was not ok');

            }

        } catch (error) {
            console.error('Error fetching data with Fetch API:', error);
        }
    }

    fetchRepoData(repoName, itemsPerPage, 1, sort);


    // number of list repo button click event
    $('.numberoflist a').on('click', function (event) {
        event.preventDefault();

        // Get the clicked value
        var selectedValue = $(this).data('value');

        // Update the button text with the selected value
        $('#number_of_repo').text(selectedValue);
        itemsPerPage = $('#number_of_repo').text();
        currentPage = 1
        fetchRepoData(repoName, selectedValue, currentPage, sort);
        fetchRepoDataCount()
    });

    // sorting by created
    $('.sorting a').on('click', function (event) {
        event.preventDefault();

        // Get the clicked value
        var selectedText = $(this).text();
        var selectedValue = $(this).data('value');
        // Update the button text with the selected value
        $('#sortingvalue').text(selectedText);
        currentPage = 1
        fetchRepoData(repoName, itemsPerPage, currentPage, selectedValue);
        fetchRepoDataCount()
    });




    // pagination
    async function fetchRepoDataCount() {

        try {
            const response = await fetch(`https://api.github.com/users/${repoName}/repos`);

            if (response.ok) {
                const data = await response.json();
                // console.log('Fetched data with Fetch API:', data);

                const totalCount = data.length;
                totalpages = Math.ceil(totalCount / Math.round(itemsPerPage));

                generatePaginationButtons(totalpages);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error fetching data with Fetch API:', error);
        }
    }

    function generatePaginationButtons(totalPages) {
        const paginationContainer = $('#pagination-container');
        paginationContainer.empty();
        const pagesToShow = 5;
        const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            const button = $('<button>', {
                type: 'button',
                class: 'btn btn-outline-dark',
                text: i,
                click: function () {
                    currentPage = i
                    fetchRepoData(repoName, itemsPerPage, i, sort);
                    fetchRepoDataCount()
                }
            });

            if (i == currentPage) {
                button.addClass('active');
            }

            if (totalPages == 1) {
                button.addClass('active');
                $('#prevbtn').prop('disabled', true);
                $('#nextbtn').prop('disabled', true);
            }

            paginationContainer.append(button);

        }

        const prevButton = $('<button>', {
            type: 'button',
            id: 'prevbtn',
            class: 'btn btn-outline-dark',
            'aria-label': 'Previous Button',
            html: '<i class="fa-solid fa-angles-left"></i>',
            click: prevPage
        });
        paginationContainer.prepend(prevButton);

        if (currentPage == 1) {
            $('#prevbtn').prop('disabled', true);
        }

        const nextButton = $('<button>', {
            type: 'button',
            id: 'nextbtn',
            class: 'btn btn-outline-dark',
            'aria-label': "Next Button",
            html: '<i class="fa-solid fa-angles-right"></i>',
            click: nextPage
        });
        paginationContainer.append(nextButton);
        if (currentPage == totalPages) {
            $('#nextbtn').prop('disabled', true);
        }


    }


    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            fetchRepoDataCount()
            fetchRepoData(repoName, itemsPerPage, currentPage, sort);
        } else {
            $('#prevbtn').prop('disabled', true);
        }
    }

    function nextPage() {
        const totalPages = totalpages;
        if (currentPage < totalPages) {
            currentPage++;
            fetchRepoDataCount()
            fetchRepoData(repoName, itemsPerPage, currentPage, sort);
        } else {
            $('#nextbtn').prop('disabled', true);
        }
    }

    fetchRepoDataCount();


});