def func(x):
    return x + 1


def test_answer_wrong():
    assert func(3) == 5


def test_answer_right():
    assert func(4) == 5
