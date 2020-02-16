new Vue({
    el: '#app',
    data: {
        emojis: [],
        emojiResults: [],
        emojiResultsToShow: [],
        pageNo: 0,
        perPage: 100,
        searchKeyword: '',
        // groups: [
        //     "Smileys & Emotion",
        //     "People & Body",
        //     "Animals & Nature",
        //     "Food & Drink",
        //     "Travel & Places",
        //     "Activities",
        //     "Objects",
        //     "Symbols",
        //     "Flags"
        // ],
        // subgroups: [],
        // categories: [],
        loading: false
    },

    created() {
        this.fetchEmojis();
    },

    mounted() {
        $('.emoji').popover({
            animation: true,
            placement: 'top',
            template: `
                <div class="popover" role="tooltip">
                    <div class="arrow"></div>
                    <h3 class="popover-header"></h3>
                    <div class="popover-body"></div>
                </div>
            `
        });

        $(window).scroll(() => {
            if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                this.nextPage();
            }
        });

    },

    methods: {
        fetchEmojis() {
            this.loading = true;
            fetch('/emoji-data.json')
                .then(
                    (response) => {
                        response.json().then((data) => {
                            this.emojis = data;
                            this.emojiResults = data;
                            this.pageNo = 1;
                            this.emojiResultsToShow = this.emojiResults.slice(0, this.perPage);
                            this.loading = false;
                        });
                    }
                )
                .catch(function (err) {
                    console.log('Error fetching Emojis', err);
                });
        },

        search() {
            if (this.searchKeyword.length === 0)
                this.emojiResults = this.emojis;
            else this.emojiResults = this.emojis.filter(
                emoji => {
                    return emoji.name.search(new RegExp(this.searchKeyword, "i")) >= 0
                }
            );
            this.pageNo = 1;
            this.emojiResultsToShow = this.emojiResults.slice(0, this.perPage);
        },

        nextPage() {
            if (this.emojiResultsToShow < this.emojiResults) {
                this.loading = true;
                this.pageNo++;
                let lastIndex = Math.min(this.pageNo * this.perPage, this.emojiResults.length);
                this.emojiResultsToShow = this.emojiResults.slice(0, lastIndex);
                this.loading = false;
            }
        }
    }
})