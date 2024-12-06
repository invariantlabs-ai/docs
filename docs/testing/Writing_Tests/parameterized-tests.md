# Parameterized Tests

<div class='subtitle'>Use parameterized tests to test multiple scenarios</div>

In some cases, a certain agent functionality should generalize to multiple scenarios. For example, a weather agent should be able to answer questions about the weather in different cities. 

In `testing`, instead of writing a separate test for each city, you can use parameterized tests to test multiple scenarios. This ensures robustness and generalization of your agent's behavior.

```python
from invariant.testing import Trace, assert_equals, parameterized
import pytest

@pytest.mark.parametrize(
    ("city",),
    [
        ("Paris",),
        ("London",),
        ("New York",),
    ]
)
def test_check_weather_in(city: str):
    # create a Trace object from your agent trajectory
    trace = Trace(
        trace=[
            {"role": "user", "content": f"What is the weather like in {city}"},
            {"role": "agent", "content": f"The weather in {city} is 75°F and sunny."},
        ]
    )

    # make assertions about the agent's behavior
    with trace.as_context():
        # extract the locations mentioned in the agent's response
        locations = trace.messages()[-1]["content"].extract("locations")

        # assert that the agent responded about the given city
        assert_equals(
            1, len(locations), "The agent should respond about one location only"
        )

        assert_equals(city, locations[0], "The agent should respond about " + city)
```

### Visualization

When pushing the parameterized test results to Explorer (`invariant test --push`), the resulting test instances will be listed separately:

<img src="../../assets/parameterized_tests.png"/>