# Test package initialization 

# Test with mock
result = get_mapping_suggestion("any prompt", mock=True)
print(result)

# Test with real API (if key available)
result = get_mapping_suggestion("real prompt", mock=False)
print(result) 