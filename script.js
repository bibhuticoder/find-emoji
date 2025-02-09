new Vue({
    el: '#app',
    data: {
        emojis: [],
        activeEmoji: null,
        emojiResults: [],
        emojiResultsToShow: [],
        pageNo: 0,
        perPage: 100,
        searchKeyword: '',
        loading: false,
        clipboard: null
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

        this.clipboard = new ClipboardJS('.emoji');
    },

    methods: {
        fetchEmojis() {
            this.loading = true;
            fetch('./emoji-data.json')
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
                    return emoji.name.search(new RegExp(this.searchKeyword, "i")) >= 0 || emoji.category.search(new RegExp(this.searchKeyword, "i")) >= 0 || emoji.group.search(new RegExp(this.searchKeyword, "i")) >= 0 || emoji.subgroup.search(new RegExp(this.searchKeyword, "i")) >= 0
                }
            );
            this.pageNo = 1;
            this.activeEmoji = null;
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
        },

        copyToClipboard(emoji, index) {
            this.activeEmoji = emoji;
            $('#emoji-' + index).tooltip('show');
            setTimeout(() => {
                $('#emoji-' + index).tooltip('hide');
            }, 500);
        }
    }
})
