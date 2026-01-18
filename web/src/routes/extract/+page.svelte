<script>
    let { form } = $props();
</script>

<form method="POST" action="?/extractSyllabus" enctype="multipart/form-data">
    <input type="file" name="syllabus" placeholder="Upload a syllabus" />
    <button type="submit">Extract syllabus</button>
</form>

{#if form?.state === 'DONE' && form?.topics}
    <pre>{form.topics}</pre>
{/if}
