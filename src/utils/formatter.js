export default function ( adapter, value, format ) {
    return typeof format === "function" ?
        format( adapter, value ) :
        adapter.format( value, format );
}