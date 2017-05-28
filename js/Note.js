//definicja notki
let Note = React.createClass({
    getInitialState: function() {
        return {editing: false}
    },
    componentWillMount: function() {
        this.style = {
            right: this.randomBetween(0, window.innerWidth - 150) + 'px',
            top: this.randomBetween(0, window.innerHeight - 150) + 'px',
            transform: 'rotate(' + this.randomBetween(-15, 30) + 'deg)'
        }
    },
    //Funkcja jQuery do przemieszczania obiektów 
    componentDidMount: function() {
        $(this.getDOMNode()).draggable()
    },
    randomBetween: function(min, max) {
        return (min + Math.ceil(Math.random() * max))
    },
    edit: function() {
        this.setState({editing: true})
    },
    save: function() {
        this.props.onChange(this.refs.newText.getDOMNode().value, this.props.index)
        this.setState({editing: false})
    },
    remove: function() {
        this.props.onRemove(this.props.index)
    },
    //odpowiedzialny za wygląd notki
    renderDisplay: function() {
        return (
            <div className="note"
                style={this.style}>
                <p>{this.props.children}</p>
                <span>
                    <button onClick={this.edit} className="btn btn-primary glyphicon glyphicon-pencil"/>
                    <button onClick={this.remove} className="btn btn-danger glyphicon glyphicon-trash"/>
                </span>
            </div>
            )
    },
    //wygląd notki podczas edytowania
    renderForm: function () {
        return (
            <div className="note" style={this.style}>
                <textarea ref="newText" defaultValue={this.props.children} className="from-control"></textarea>
                <button onClick={this.save} className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk"/>
            </div>    
        )
    },
    //mechanika działania notki
 render: function() {
        if (this.state.editing) {
            return this.renderForm()
        }
        else {
            return this.renderDisplay()
        }
    }
})
//definicja Tablicy
let Board = React.createClass({
    propTypes: {
        count: function(props, propName) {
            if (typeof props[propName] !== "number"){
                return new Error('The cout property must be a number')
            }
            if (props[propName] > 100) {
                return new Error("Creating " + props[propName] + " notes is radicilus")
            }  
        }
    },
    //lista notatek startowych
    getInitialState: function() {
        return {
            notes:[]
        }
    },
    nextId: function() {
        this.uniqueId = this.uniqueId || 0
        return this.uniqueId++
    },
    //pobieranie ulotek poprzez funkcję JQuery
    componentWillMount: function() {
        var self = this;
        if(this.props.count) {
            $.getJSON("http://baconipsum.com/api/?type=all-meat&sentences=" +
                      this.props.count + "&start-with-lorem=1&callback=?", function(results){
                results[0].split('. ').forEach(function(sentence){
                    self.add(sentence.substring(0,20))
                    })
            })
        }
    },
    //funkcja dodająca nową notkę do tablicy
    add: function(text) {
        let arr = this.state.notes
        arr.push({
            id: this.nextId(),
            note: text
        })
        this.setState({notes: arr})
    },
    //przypisanie nowego tekstu
    update: function(newText, i) {
       let arr = this.state.notes
       arr[i].note = newText
       this.setState({notes:arr})
    },
    //usuwanie
    remove: function(i) {
        let arr = this.state.notes
        arr.splice(i, 1)
        this.setState({notes: arr})
        
    },
    // dodanie funkcjonalności do każdej notki
    eachNote: function(note, i) {
        return (
            <Note key={note.id}
                index={i}
            onChange={this.update}
            onRemove={this.remove}
            >{note.note}</Note>
        )
    },  
    // mechanika wyświetlania tablicy i notek na niej
    render: function() {
        return (<div className="board">
                    {this.state.notes.map(this.eachNote)}
                    <button className="btn btn-sm btn-success glyphicon glyphicon-plus"
                        onClick={this.add.bind(null, "NEW NOTE")}/></div>
        )
    }
})
React.render(<Board count={10}/>,
    document.getElementById('react-container'))