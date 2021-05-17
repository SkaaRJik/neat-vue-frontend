<template>
  <v-container>
    <v-row>
      <v-col v-if="info.legend_info.length > 0">
        <v-card style="height: 100%">
          <v-card-title>
            {{ $t("VERIFICATION_LEGEND_INFO") }}
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>
                      {{ $t("Details") }}
                    </th>
                    <th>
                      {{ $t("Position") }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in info.legend_info" :key="index">
                    <td>{{ $t(item.message) }}</td>
                    <td>{{ item.position }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="info.values_info.length > 0">
        <v-card style="height: 100%">
          <v-card-title>
            {{ $t("VERIFICATION_VALUES_INFO") }}
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>
                      {{ $t("Details") }}
                    </th>
                    <th>
                      {{ $t("Column_name") }}
                    </th>
                    <th>
                      {{ $t("Position") }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in info.values_info" :key="index">
                    <td>{{ $t(item.message) }}</td>
                    <td>{{ item.columnName }}</td>
                    <td>{{ item.position }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "VerificationInfo",
  props: {
    info: {
      legend_info: Array,
      values_info: Array
    }
  },
  data: () => {
    return {};
  }
};
</script>

<style scoped></style>
