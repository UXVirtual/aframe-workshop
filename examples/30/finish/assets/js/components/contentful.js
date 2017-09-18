AFRAME.registerComponent('contentful', {
    schema: {
        spaceID: {type: 'string', required: true},
        accessToken: {type: 'string', required: true},
        container: {type: 'selector', required: true}
    },

    init: function() {

        console.log('Contentful: ',contentful);

        this.client = contentful.createClient({
            // This is the space ID. A space is like a project folder in Contentful terms
            space: this.data.spaceID,
            // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
            accessToken: this.data.accessToken
        });

        console.log('Client: ',this.client);

        console.log('\nWelcome to the Contentful JS Boilerplate\n');
        console.log('This is a simplified example to demonstrate the usage of the Contentful CDA\n');

        this.runBoilerplate();

    },

    // Entry point of the boilerplate, called at the end.
    runBoilerplate: function() {
        this.displayContentTypes()
            .then(function(contentTypes){
                this.displayEntries(contentTypes);
            }.bind(this))
            .then(function(){
                console.log('Want to go further? Feel free to check out this guide:');
                console.log('https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/\n')
            });
            /*.catch(function(error) {
                console.info('\nError occurred:');
                if (error.stack) {
                    console.error(error.stack);
                    return
                }else{
                    console.error(error);
                }

            });*/
    },


    displayContentTypes: function() {
        console.log('Fetching and displaying Content Types ...');

        return this.fetchContentTypes()
            .then(function(contentTypes){

                // Display a table with Content Type information
                /*const table = new Table({
                    head: ['Id', 'Title', 'Fields']
                })*/
                contentTypes.forEach(function(contentType){
                    const fieldNames = contentType.fields
                        .map(function(field){ return field.name })
                        .sort();

                        //table.push([contentType.sys.id, contentType.name, fieldNames.join(', ')])
                });
                console.log(table.toString());

                return contentTypes;
            })
    },

    displayEntries: function(contentTypes) {
        console.log('Fetching and displaying Entries ...');

        console.log('This: ',this);

        return Promise.all(contentTypes.map(function(contentType){

            console.log('This2: ',this);

            return this.fetchEntriesForContentType(contentType)
                .then(function(entries){
                    console.log('\nThese are the first 100 Entries for Content Type '+contentType.name+':\n');

                    // Display a table with Entry information
                    /*const table = new Table({
                        head: ['Id', 'Title']
                    })*/

                    var html = '';

                    entries.forEach(function(entry){

                        console.log(entry);

                        console.log('Contenttype: ',contentType);

                        html += '<h1>'+entry.fields[contentType.displayField]+'</h1>'+entry.fields['productDescription'];
                        //table.push([entry.sys.id, entry.fields[contentType.displayField] || '[empty]'])
                    });

                    console.log('Inserting html: ',html);

                    console.log('Container el: ',this.data.container);

                    this.data.container.innerHTML = html;

                    //console.log(table.toString())
                }.bind(this))
        }.bind(this)));
    },

    // Load all Content Types in your space from Contentful
    fetchContentTypes: function () {
        return this.client.getContentTypes()
            .then(function(response){ return response.items })
            .catch(function(error){
                console.info('\nError occurred while fetching Content Types:');
                console.error(error)
            });
    },

    // Load all entries for a given Content Type from Contentful
    fetchEntriesForContentType: function (contentType) {
        return this.client.getEntries({
                content_type: contentType.sys.id
            })
            .then(function(response){ return response.items })
            .catch(function(error){
                console.log('\nError occurred while fetching Entries for '+contentType.name+':\n');
                console.error(error)
            });
    },

    tick: function() {


    }
});