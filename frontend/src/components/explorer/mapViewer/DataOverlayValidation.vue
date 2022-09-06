<template>
  <div class="file is-centered mb-2">
    <label class="file-label">
      <input
        class="file-input"
        type="file"
        @change="validateFile"
        @click="$event.target.value = ''"
      />
      <span class="file-cta">
        <span class="file-icon">
          <i class="fa fa-upload"></i>
        </span>
        <span class="file-label">Choose a file</span>
      </span>
    </label>
  </div>
</template>

<script>
import { default as messages } from '@/content/messages';

export default {
  name: 'DataOverlayValidation',
  emits: ['errorCustomFile', 'getFileName'],
  methods: {
    validateFile(e) {
      if (e.target.files.length !== 0) {
        if (e.target.files[0].type !== 'text/tab-separated-values') {
          this.$emit('errorCustomFile', [`Error: ${messages.noTSVfile}`], e.target.files[0].name);
          return;
        }
        const errors = [];
        const reader = new FileReader();
        reader.onloadend = evt => {
          const lines = evt.target.result.split(/\r?\n/);
          const header = lines[0].split('\t');
          if (header[0] !== 'id') {
            errors.push(`Error: ${messages.noIDColumn}. First column should not be ${header[0]}`);
          }
          const colTitles = [];
          header.forEach(colTitle => {
            if (colTitles.indexOf(colTitle) > -1) {
              errors.push(`Error: ${messages.duplicateColName} ${colTitle}`);
            } else {
              colTitles.push(colTitle);
            }
          });
          // No further checks if invalid TSV format
          if (header.length !== 1 && lines.length > 2) {
            header.forEach(name => {
              if (name.length > 20) {
                errors.push(`Error: ${messages.columnNameLength}, ${name} has ${name.length}`);
              }
            });
            lines.slice(1).forEach((line, pos) => {
              if (line.length > 0) {
                const columnValues = line.split('\t');
                if (columnValues.length !== header.length) {
                  errors.push(`Error: ${messages.numOfValues} line ${pos}`);
                }
                if (columnValues[0].length > 20) {
                  errors.push(
                    `Error: ${messages.idNameLength}, ${columnValues[0]} has ${columnValues[0].length}`
                  );
                }
                columnValues.slice(1).forEach(value => {
                  if (Number.isNaN(Number(value)) || value < 0 || value > 1) {
                    errors.push(`Error: ${value} ${messages.levelsRange}`);
                  }
                });
              }
            });
          } else {
            errors.push(`Error: ${messages.invalidTSV}`);
          }
          if (errors.length > 0) {
            this.$emit('errorCustomFile', errors, e.target.files[0].name);
          } else {
            this.$emit('getFileName', e.target.files[0]);
          }
        };
        reader.readAsText(e.target.files[0]);
      }
    },
  },
};
</script>
