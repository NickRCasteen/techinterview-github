//>
//>>
//*******************************************************************************************************
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% [ FEED REFRESH ] %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//*******************************************************************************************************
function refresh()
{
    //This code is the first to be run. It'll build up the DOM and populate
    //our first group of cards. After that, it'll be run every time the client
    //hits the 'refresh button'.
    
    resetBody();
    
    
    var request = new XMLHttpRequest();
    const table = document.getElementById('sorter_tab'); //the id for our HTML table
    
    
    request.open('GET', 'https://api.github.com/events', true); //HERE IT COMES.

    request.onload = function () {

        // It begins
        var data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            //Set up variables.
            var col_count = 0; //The counter for columns in the grid.
            var tempor = null; //This is an object that stores <tr> elements
            var num_columns = 3; //The number of columns we want for our cards.
            
            data.forEach(event => {
                
                //Every loop counts columns up by 1
                //Every 3rd column places a new <tr> in the table.
                //Since each new <tr> is loaded into the same 'tempor' var
                //then each card can safely be appended inside without worry
                //as to where any other cards are in the table. Rows completed
                //are inaccessable.
                if (col_count%num_columns === 0)
                {
                    //Create and reference a new <tr> in tempor
                    tempor = document.createElement('tr');
                    //Apply new <tr> to the table
                    table.appendChild(tempor);
                }
                
                //HERE IS THE MODAL. This will display 'more information'. 
                modalCreation(event);
                
                //HERE IS THE PARENT BUTTON. It's given the card class and the ability
                //to toggle modals.
                cardCreation(event, tempor);
                
                //Column count +1. The col_count%num_columns limits the
                //number of columns to num_columns
                col_count+=1;
                
            });
        } 
        else {
            console.log('error');
        }
    };

    request.send();
}


//>
//>>
//*******************************************************************************************************
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% [ MODAL CREATION ] %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//*******************************************************************************************************
function modalCreation(event)
{
    //>> COMPONENT CREATION <<
    // :: MODAL NESTED DIVS ::
    const modal = document.createElement('div');
    const modal_diag = document.createElement('div');
    const modal_cont = document.createElement('div');
    const modal_header = document.createElement('div');
    const modal_body = document.createElement('div');
    // :: MODAL TEXT ::
    const mh4 = document.createElement('h4');
    const mh42 = document.createElement('h4');
    const mp = document.createElement('p');
    // :: MODAL VISUAL FLUFF ::
    const avi = document.createElement('img');
    const orgdesc = document.createElement('p');
      
    //MAIN MODAL ATTRIBUTE SET
    modal.setAttribute('id', `${event.id}`);
    modal.setAttribute('class', 'modal fade');
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', `h_info${event.id}`);
    modal.setAttribute('aria-hidden', 'true');
    
    //CHILD ATTRIBUTE SET
    modal_diag.setAttribute('class', 'modal-dialog');
      
    //GRANDCHILD ATTRIBUTE SET
    modal_cont.setAttribute('class', 'modal-content');
      
    //G.GRANDCHILD #1 ATTRIBUTE SET
    modal_header.setAttribute('class', 'modal-header');
    modal_header.setAttribute('id', `h_info${event.id}`);
      
    //G.GRANDCHILD #2 ATTRIBUTE SET
    modal_body.setAttribute('class', 'modal-body');
    
    //TEXT ATTRIBUTE SET
    mh4.setAttribute('class', 'modal-title');
    mh4.textContent = `${event.actor.display_login}`;
    
    //TEXT ATTRIBUTE SET
    mh42.textContent = `${event.repo.name}`;
    mh42.setAttribute("class", "repository");
    
    //TEXT ATTRIBUTE SET
    mp.innerHTML = `Public: ${event.public}<br>Event Created: ${event.created_at}<br>`;
    
    //VISUAL FLUFF: USER AVITAR ATTRIBUTE SET
    avi.setAttribute("src", `${event.actor.avatar_url}`);
    avi.setAttribute("width", "100vw");
    avi.setAttribute("height", "100vw");
    
    //VISUAL FLUFF: ORGANIZATION AVITAR ATTRIBUTE SET
    if(event.hasOwnProperty('org'))
    {
        //This code only executes if the JSON object actually has an 'org' key. Otherwise skip it.
        orgdesc.innerHTML = `<img src=${event.org.avatar_url} width="100vw" height="100vw">From the Oragnization of ${event.org.login}`;
    }
            
    //MODAL TREE ASSEMBLY
    //Stick to the body
    document.body.appendChild(modal);
    //Assemble the children
    modal.appendChild(modal_diag);
    modal_diag.appendChild(modal_cont);
    modal_cont.appendChild(modal_header);
    modal_cont.appendChild(modal_body);
    //Apply text + Organization fluff. If above code was skipped, orgdesc will just be empty
    modal_header.appendChild(orgdesc);
    modal_header.appendChild(mh4);
    modal_header.appendChild(mh42);
    modal_body.appendChild(mp);
    //Apply fluff
    modal_body.appendChild(avi);
}


//>
//>>
//*******************************************************************************************************
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% [ CARD CREATION ] %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//*******************************************************************************************************
function cardCreation(event, row)
{
    //ELEMENT CREATION
    const card = document.createElement('button');
    const cell = document.createElement('td'); //Create a cell for the card to rest in the table.
    
    //CARD ATTRIBUTES SET
    card.setAttribute('class', 'card');
    card.setAttribute('data-toggle', 'modal');
    card.setAttribute('data-target', `#${event.id}`);
    //For id, every card needs a unique ID and needs it made dynamically. Every event
    //has a unique ID in the API's JSON, so we'll just use that.
    
    //HEADER TEXT
    const h1 = document.createElement('h4');
    h1.textContent = `${event.actor.display_login}`;
    h1.setAttribute("class", "gituser");
    
    //HEADER 2 TEXT
    const h2 = document.createElement('h4');
    //This is to cut down on the repo name, which can get crazy long. 27 char limit.
    var temp = event.repo.name
    if(temp.length > 27) temp = temp.substring(0,27);
    h2.textContent = `${temp}`;
    h2.setAttribute("class", "repository");
    //Both headers use a custom CSS class just to change text.
    
    //MAIN TEXT
    const h3 = document.createElement('h6');
    h3.textContent = event.type;

    //+++ APPENDING +++
    //This is where we place our card and its children right where they belong.
    row.appendChild(cell);
    cell.appendChild(card);
    card.appendChild(h1);
    card.appendChild(h2);
    card.appendChild(h3);
}


//>
//>>
//*******************************************************************************************************
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% [ BODY TAG RESET ] %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//*******************************************************************************************************
function resetBody()
{
    //The purpose of this code is to provide a quick and easy way to reset the body.
    //The modals are applied to the <body> tag, to keep them near the top of the DOM
    //tree. However, this also means that modals have the potential to build up
    //in the DOM. So, we apply this base HTML to the whole body to erase all traces
    //of cards and modals for every refresh. Anything about the main page should be
    //edited here.
    document.body.innerHTML = `
        <header>
        <div class="container headercontainer">
            <div class="jumbotron">
                <h1>Github Event Dashboard</h1>
                <h2>A web application to show a feed of events on Github, via their REST API</h2>
                <button type="button" class="btn btn-default btn-lg" onclick='refresh()'>
                    Refresh
                </button>
            </div>
            </div>
        </header>
    
        <div class="container" width = 60vw>
        <!-- THIS IS WHERE THE MODALS WILL GO-->
        <div class="row">
            <div class="col-md-12">
                <table align="center" id='sorter_tab'></table>
            </div>
            
        </div>
    </div>

    <footer>
        <div class="container footercontainer">
            <div class="col-md-12">
                <p class="copyright">Copyright &copy; Nicholas Casteen 2018.</p>
            </div>
        </div>
    </footer>`;
}