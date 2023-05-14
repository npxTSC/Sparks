cd dist
rm *.spark.zip
for file in *; do zip -r -o ${file}.spark.zip $file; done